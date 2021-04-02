import React            from 'react';
import SidebarHeader    from './SidebarHeader';
import SidebarList      from './SidebarList';

const SidebarContents = (props) => {
    return (
        <>
            <SidebarHeader 
                auth={props.auth} createNewList={props.createNewList} activeid={props.activeid}
            />
            <SidebarList
                activeid={props.activeid} handleSetActive={props.handleSetActive}
                listIDs={props.listIDs} createNewList={props.createNewList}
                updateListField={props.updateListField}
            />
        </>
    );
};

export default SidebarContents;