import * as firebase from 'firebase/app';
import { Action, AnyAction, Dispatch } from 'redux';
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { Project } from "../models/project";
import { AppState } from "../reducers";

export const REQUESTING_PROJECTS = 'REQUESTING_PROJECTS';
export const PROJECTS_RECEIVED = 'PROJECTS_RECEIVED';
export const PROJECTS_ERROR = 'PROJECTS_ERROR';

export interface ActionRequestingProjects extends Action {
    type: 'REQUESTING_PROJECTS';
}

export interface ActionProjectsReceived extends Action {
    type: 'PROJECTS_RECEIVED';
    projects: Project[];
}

export interface ActionProjectsError extends Action {
    type: 'PROJECTS_ERROR';
    error: string;
}

export type ProjectActions =
    ActionRequestingProjects |
    ActionProjectsReceived |
    ActionProjectsError;

export function requestingProjects(): ActionRequestingProjects {
    return {
        type: REQUESTING_PROJECTS
    }
}

export function projectsReceived(projects: Project[]): ActionProjectsReceived {
    return {
        type: PROJECTS_RECEIVED,
        projects: projects
    }
}

export function projectsError(error: string): ActionProjectsError {
    return {
        type: PROJECTS_ERROR,
        error: error
    }
}

export function fetchProjectsIfNeeded(): ThunkAction<Promise<void>, any, any, AnyAction> {
    return (dispatch: ThunkDispatch<any, any, AnyAction>, getState: () => AppState) => {
        if (shouldFetchProjects(getState())) {
            return dispatch(fetchProjects());
        } else {
            return Promise.resolve();
        }
    }
}

function shouldFetchProjects(state: AppState): boolean {
    return !state.projectState.projects || state.projectState.projects.length === 0;
}

function fetchProjects(): ThunkAction<Promise<void>, any, any, AnyAction> {
    return (dispatch: Dispatch) => {
        dispatch(requestingProjects());

        return firebase.database().ref('projects').once('value').then(
            (data: firebase.database.DataSnapshot) => {
                dispatch(projectsReceived(data.val()));
            },
            (error: string) => {
                console.error(error);
                dispatch(projectsError(error));
            }
        );
    };
}