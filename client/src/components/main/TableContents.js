import React        from 'react';
import TableEntry   from './TableEntry';

const TableContents = (props) => {

    let entries = props.activeList ? props.activeList.items : null;
    if(entries) entries = entries.filter(entry => entry !== null);
    return (
        entries ? <div className=' table-entries container-primary'>
            {
                entries.map((entry, index) => (
                    <TableEntry
                        data={entry} key={entry.id}
                        deleteItem={props.deleteItem} reorderItem={props.reorderItem}
                        editItem={props.editItem}
                    />
                ))
            }

            </div>
            : <div className='container-primary' />
    );
};

export default TableContents;