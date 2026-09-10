import { createSlice, nanoid } from "@reduxjs/toolkit";

const todoSlice = createSlice({
	name: "todo",
	initialState: {
		list: [
			{ id: 1, title: "airplane", completed: true },
			{ id: 2, title: "airplane2", completed: false },
		],
	},
	reducers: {
		addTodo: (state, action) => {
			const newTodo = {
				id: nanoid(),
				title: action.payload,
				completed: false,
			};
			state.list.push(newTodo);
		},
		toggleTodo: (state, action) => {
			const todo = state.list.find((item) => item.id === action.payload)
			if (todo) todo.completed = !todo.completed
		},
		deleteTodo: (state, action) => {
			state.list = state.list.filter((item) => item.id !== action.payload)
		},
	},
});

export const { addTodo, toggleTodo, deleteTodo } = todoSlice.actions;
export default todoSlice.reducer;