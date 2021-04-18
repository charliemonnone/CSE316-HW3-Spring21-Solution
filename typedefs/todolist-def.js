const { gql } = require('apollo-server');


const typeDefs = gql `
	type Todolist {
		_id: String!
		name: String!
		owner: String!
		items: [Item]
		sortRule: String!
		sortDirection: Int!
	}
	type Item {
		_id: String!
		description: String!
		due_date: String!
		assigned_to: String!
		completed:  Boolean!
	}
	extend type Query {
		getAllTodos: [Todolist]
		getTodoById(_id: String!): Todolist 
	}
	extend type Mutation {
		addItem(item: ItemInput!, _id: String!, index: Int!): String
		addTodolist(todolist: TodoInput!): Todolist
		deleteItem(itemId: String!, _id: String!): [Item]		
		deleteTodolist(_id: String!): Boolean
		updateTodolistField(_id: String!, field: String!, value: String!): String
		updateItemField(itemId: String!, _id: String!, field: String!, value: String!, flag: Int!): [Item]
		reorderItems(itemId: String!, _id: String!, direction: Int!): [Item]
		sortItems(_id: String!, criteria: String!): [Item]
	}
	input FieldInput {
		_id: String
		field: String
		value: String
	}
	input TodoInput {
		_id: String
		name: String
		owner: String
		items: [ItemInput]
		sortRule: String
		sortDirection: Int
	}
	input ItemInput {
		_id: String
		description: String
		due_date: String
		assigned_to: String
		completed:  Boolean
	}
`;

module.exports = { typeDefs: typeDefs }