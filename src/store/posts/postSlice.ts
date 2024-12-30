import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface postState {
    id: number,
    title: string,
    content: string,
}

const initialState: postState[] = [
    {id: 1, title: 'Best 2024 Anime', content: 'Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.'},
    {id: 2, title: 'Best 2024 Anime', content: 'Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.'}
];

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded: (state, action: PayloadAction<postState>) => {
            state.push(action.payload)
        }
    }
});