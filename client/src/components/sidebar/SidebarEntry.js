import React, { useState }  from 'react';
import { WNavItem, WInput } from 'wt-frontend';

const SidebarEntry = (props) => {
    const [editing, toggleEditing] = useState(false);
    const [preEdit, setPreEdit] = useState(props.name);
    const handleEditing = (e) => {
        e.stopPropagation();
        setPreEdit(props.name);
        toggleEditing(!editing);
    };

    const handleSubmit = (e) => {
        handleEditing(e);
        const { name, value } = e.target;
        props.updateListField(props._id, name, value, preEdit);
    };

    const entryStyle = props._id === props.activeid ? 'list-item-active' : 'list-item ';
    
    return (
        <WNavItem 
            className={entryStyle} onDoubleClick={handleEditing} 
            onClick={() => { props.handleSetActive(props._id) }} 
        >
            {
                editing ?   <WInput className="list-item-edit" inputClass="list-item-edit-input"
                                onKeyDown={(e) => {if(e.keyCode === 13) handleSubmit(e)}}
                                name='name' onBlur={handleSubmit} autoFocus={true} defaultValue={props.name} 
                            />
                        :   <div className='list-text'>
                                {props.name}
                            </div>
            }
        </WNavItem>
    );
};

export default SidebarEntry;