import { createSlice } from '@reduxjs/toolkit'

interface ProgressJob {
    id: string,
    name: string,
}

interface ProgressState {
    working: boolean,
    jobs: ProgressJob[],
}

const initialState: ProgressState = {
    working: false,
    jobs: [],
};

export const progressSlice = createSlice({
    name: 'progress',
    initialState,
    reducers: {
      addJob: (state, action) => {
        console.log(`adding job ${action.payload}`);
        console.log(state.jobs);
        state.jobs.push(action.payload);
        state.working = true;
      },
      removeJob: (state, action) => {
        console.log(`removing job ${action.payload}`);
        console.log(state.jobs);
        state.jobs = state.jobs.filter(job => job.id !== action.payload);
        state.working = state.jobs.length > 0;
      },
    },
    extraReducers: (builder) => {      
    }
  })
  
  export const { addJob, removeJob } = progressSlice.actions
  
  export default progressSlice.reducer