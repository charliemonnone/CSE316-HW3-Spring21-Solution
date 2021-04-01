# TodoTracker

## VIP Application Platform


#### Overview . . . . . . . . . . . . . . . . . . . .
The VIP Application Platform is primarily built using the Apollo Platform, specifically Apollo Client and Apollo Server. The subject of this document is an example application intended to serve as a rough guide for the structure of future applications utilizing the platform. The below sections go into detail about the constituent parts of the client and server domains of the application. Additionally, there are links to the documentation of the technologies used at the end of platform description; it\'s strongly advised to read them, particularly the docs relating to the Apollo Platform and GraphQL.

#### Getting Started. . . . . . . . . . . . . . . . .
Before working with the todo-list prototype application, make sure Node.js is installed on your machine (https://nodejs.org/en/). To get started with the platform either clone or download the zip of the git repository: https://github.com/charliemonnone/TodoTracker. If you don\'t have access, mention it in the VIP Slack channel and someone will add you. In the TodoTracker folder complete the following steps:
* Run git switch local-build to switch to the development branch intended for local use.
* In the root directory (TodoTracker/) run npm install
* Go to the client directory(TodoTracker/client) using cd client and run  npm install again.
* Return to the root directory using cd ..

You now have everything you need to start the application, and there are two options for starting the application:

* Run npm start in the root directory
* Run nodemon in the root directory and npm start in the client directory

Generally option 1 is the preferred method as it is more convenient than manually running two separate scripts, but depending on what you’re working on, having both the front and back end servers running may be unnecessary.

#### Server . . . . . . . . . . . . . . . . . . . . .
__Index and Server-Config__
Index.js is the main entry point for the server; it handles the creation of the server, applies middleware to the server, and defines the database connection. Server-Config is an optional file meant to help organize the middleware used by the server.

In the todolist example application, enough middleware code exists to the point where index.js would become difficult to parse, so for the sake of retaining a simplified overview of the server, much of the middleware setup is handled in server-config.js, including the validation of refresh and access tokens.

The server used by the todolist application is actually two servers: an Apollo Server, which is a GraphQL server, and an ExpressJS server. We do this so that we can combine the mature ecosystem of middleware written for express with the simplicity of a GraphQL server. Much of the middleware we use is applied to the express server, and we use Apollo\'s official express integration to treat the express server as middleware for the Apollo Server. GraphQL queries and mutations are combined with resolvers to define the types of requests we can make to the Apollo Server.

__Tokens__ 
The application platform utilizes a JSON Web Token(JWT) based system for authentication. Tokens.js handles the generation of access and refresh tokens, which are stored cookies that the server is able to parse. Upon each request to the server, a middleware function(defined in server-config.js) looks for both the access and refresh tokens. Depending on the server request, invalid or missing tokens imply specific situations: 
* A valid access token means the user is logged in.
* An invalid/missing access token with a valid refresh token means the user has logged in to the service in the past 7 days.

Invalid/missing access and refresh tokens could also mean the user has never logged in; depending on the circumstance, the server middleware will either generate missing tokens or refuse the request.

__Models__
The model files define the schema used for the database. The todolist application uses MongoDB along with Mongoose as an Object Document Mapper(ODM); other databases can be used but keep in mind that resolver functions are closely related to the database configuration and would need to be rewritten.

__TypeDefs__
The typedef files are what define the GraphQL layer used by the server. In addition to defining types, queries and mutations that operate on and utilize those types are detailed by the typedef files as well. Queries and mutations describe requests and operations for a data source, which, in our case, is a MongoDB database. Both queries and mutations are resolved, as it were, by resolvers in the server\'s resolver map.

__Resolvers__
The resolvers files are where substantive changes to data occurs. Resolver functions are passed arguments from queries and mutations, and interact with the database to retrieve, update, and delete data.

#### General Flow of Server Requests . . . . . . . . 
A line like this often appears in the client code:

`const { loading, error, data } = useQuery(...);`

When a query/mutation is made, different states are returned depending on the execution phase. Loading and error are fairly straightforward, and data contains any return values.

In the average case, a query or mutation will originate from the client and be passed to the backend server url(or uri, as it is defined by the client object). Every request sends along cookies which may or may not contain access or refresh tokens. The request is validated and passed through any remaining middleware functions. 

The GraphQL server will receive the query/mutation as part of the request, verify that it perfectly matches its corresponding typedef and will search the resolver map for a resolver matching the name of the query/mutation. Once the resolver is found, it\'s executed and any return type defined by the query/mutation is sent back to the originating request in the data object.

#### Client . . . . . . . . . . . . . . . . . . . . .
__Index and App__
Index.js serves as the entry/start point for the client and defines the root node for React. Index primarily configures the Apollo Client and sets it as a Provider for the React tree of nodes. Providers and Contexts are part of the React API; a brief explanation of a Context is that exposes data and functions defined in the Provider to all child nodes of the React component that receives the Provider as a prop. Since the Apollo Client is a Provider that is passed to the root component App.js, every component in the React application has access to the Apollo Client. We do this for two reasons:
* The client is specifically configured to communicate with our Apollo Server, which allows for relatively easy access to the database.
* The client serves as our application\'s state manager, which is an important part of any application with a sufficient amount of user interactivity.

Most of the client configuration is straightforward; we set a uri, `uri: SERVER_LOCAL_DOMAIN`, which points to our backend server. We tell the client to include authentication related cookies with `credentials: 'include'`. We also initialize the cache and define resolvers corresponding to the queries and mutations that operate on the cache. Much like the backend, Apollo Client is built for use with GraphQL, only now our data source is the local cache in the client as opposed to our Mongo database. Apollo Client serializes queries and mutations in the form of TYPNAME:ID, where TYPENAME is taken from the `__typename` field defined in a GraphQL type, and ID is taken from an object\' `_id` field, which is of an ObjectID type. This step is done on the line:

`` dataIdFromObject: object => `${object.__typename}:${object._id}` ``.

__Cache__
The Cache folder holds the client\'s GraphQL related code: queries, mutations, and resolvers. The queries and mutations operate in the exact same way as those defined for the backend, with a few tweaks to take note of. By default, since our client is connected to our backend, and by extension the typedefs and resolvers defined there, if we simply define our queries and mutations exactly as we did for the backend then they would completely ignore any of the data in the cache. To run queries and mutations on data stored in the cache, they must bear an `@client` annotation as such:

`getItems @client {`
`id`
`description`
`...`
`}`

Keep in mind that @client simply tells the apollo server to first check the cache; if for whatever reason the query does not find a matching resolver in the client\'s resolver map, Apollo Client will send it along to the backend in the chance that it has a matching resolver there.

Client resolvers also serve the same purpose as those defined for the backend: they perform operations and return data, only now the data source is the client cache and the data are queries and mutations that have been cached after a call to the backend. The primary difference is in the API used to work with the data; for the backend we work with Mongoose to manipulate database information. For the cache, we use the API defined in the Apollo Client documentation.

Generally, a resolver will work like this:
Using an ObjectID and the GraphQL type, get a valid cache key for the specified object: 

`const _id = getCacheKey({__typename: 'Todolist', _id: args._id})`

Using a GraphQL query or fragment(similar to a query, but doesn’t require every field of queried type to be defined) and the cache key, get the object:

   ` fragment Name on Todolist {`
       ` name @ client`
    `};`
	
`const mutateTodo = cache.readFragment({id: _id, fragment: fragment})`
Perform whatever mutation is intended on the object, or simply return it:
* The first line uses a spread operator to return an object with the values of mutateTodo, with the exception that the name field is updated to have value

`let data = {...mutateTodo, [field]: value} `
`cache.writeData({id: _id, data});  `
`return; `

__Components__
The Components folder holds React components. A full explanation of the React library is beyond the scope of the document, and would be a poorer explanation than that provided by the official documentation. Since React is an integral part of the application, and it is assumed that future VIP applications will be written using React it is highly recommended to familiarize yourself with the React documentation (found here: https://reactjs.org/docs/getting-started.html).

__Utils__
The utils folder is a bit subjective; it is intended to hold javascript code that does not explicitly deal with React or Apollo Client. For TodoTracker, the undo/redo and sorting functionalities will be defined in utils, though neither are currently implemented. 

__CSS__
All CSS files should go in this folder. To editorialize a bit: separating css layout and style attributes into separate css files makes tweaking either easy without unintentionally tweaking something.

#### Relevant Links . . . . . . . . . . . . . . . . .


https://mongoosejs.com/docs/guide.html

https://reactjs.org/docs/getting-started.html

https://www.apollographql.com/docs/react/

https://www.apollographql.com/docs/apollo-server/

https://jwt.io/introduction/

https://graphql.org/learn/

http://expressjs.com/
