const byTask = (items, direction) => {
	if(direction === 1) items.sort((a,b) => a.description.toUpperCase() > b.description.toUpperCase() ? 1 : -1);
	else items.sort((a,b) => a.description.toUpperCase() < b.description.toUpperCase() ? 1 : -1);
	return items;
}

const byDueDate = (items, direction) => {
	if(direction === 1) items.sort((a,b) => a.due_date > b.due_date ? 1 : -1);
	else items.sort((a,b) => a.due_date < b.due_date ? 1 : -1);
	return items;

}

const byStatus = (items, direction) => {
	if(direction === 1) items.sort((a,b) => a.completed > b.completed ? 1 : -1);
	else items.sort((a,b) => a.completed < b.completed ? 1 : -1);
	return items;
	
}

const byAssignedTo = (items, direction) =>{
	if(direction === 1) items.sort((a,b) => a.assigned_to.toUpperCase() > b.assigned_to.toUpperCase() ? 1 : -1);
	else items.sort((a,b) => a.assigned_to.toUpperCase() < b.assigned_to.toUpperCase() ? 1 : -1);
	return items
	
}

module.exports = {byTask, byDueDate, byStatus, byAssignedTo}
