import { List, Map } from 'immutable';
import { createStore, Dispatch } from 'toomanyhoox';

import State, { Stage } from './state';
import Candidate from './candidate';
import Voter from './voter';

// UTIL

export const initState: (() => State) = () => ({
	candidates: Map<string, Candidate>(),
	voters: List<Voter>(),
	stage: "candidates"
});

export function getPrevStage(curr: Stage): Stage | undefined {
	switch (curr) {
		case "candidates":
			return undefined;
		case "voters":
			return "candidates";
		case "results":
			return "voters";
	}
}

export function getNextStage(curr: Stage): Stage | undefined {
	switch (curr) {
		case "candidates":
			return "voters";
		case "voters":
			return "results";
		case "results":
			return undefined;
	}
}

export function getFriendlyStageName(stage: Stage): string {
	switch (stage) {
		case "candidates":
			return "Set Options";
		case "voters":
			return "Individual Preferences";
		case "results":
			return "See Results";
	}
}

// ACTIONS

type NextStage = {
	type: "NextStage"
}

type PrevStage = {
	type: "PrevStage"
}

type AddCandidate = {
	type: "AddCandidate",
	candidate: string
}

type RemoveCandidate = {
	type: "RemoveCandidate",
	candidate: Candidate
}

type SetVoter = {
	type: "SetVoter",
	index: number,
	voter: Voter
}

type Action
	= NextStage
	| PrevStage
	| AddCandidate
	| RemoveCandidate
	| SetVoter;

// REDUCERS

function nextStage(state: State, action: NextStage): State {
	const next = getNextStage(state.stage);

	return next
		? { ...state, stage: next }
		: state;
}

function prevStage(state: State, action: PrevStage): State {
	const prev = getPrevStage(state.stage);

	return prev
		? { ...state, stage: prev }
		: state;
}

function addCandidate(state: State, action: AddCandidate): State {
	if (action.candidate == "")
		return state;

	const newCandidate = { name: action.candidate };

	return {
		...state,
		candidates: state.candidates.set(action.candidate, newCandidate)
	}
}

function removeCandidate(state: State, action: RemoveCandidate): State {
	return {
		...state,
		candidates: state.candidates.remove(action.candidate.name)
	}
}

function setVoter(state: State, action: SetVoter): State {
	return {
		...state,
		voters: state.voters.set(action.index, action.voter)
	}
}

export function reducer(state: State, action: Action): State {
	if (!action || !action.type)
		return state;

	switch (action.type) {
		case "NextStage":
			return nextStage(state, action);
		case "PrevStage":
			return prevStage(state, action);
		case "AddCandidate":
			return addCandidate(state, action);
		case "RemoveCandidate":
			return removeCandidate(state, action);
		case "SetVoter":
			return setVoter(state, action);
	}
}

// DISPATCH PROPS

export const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
	nextStage: () => dispatch({ type: "NextStage" }),
	prevStage: () => dispatch({ type: "PrevStage" }),
	addCandidate: (candidate: string) => dispatch({
		type: "AddCandidate",
		candidate
	}),
	removeCandidate: (candidate: Candidate) => dispatch({
		type: "RemoveCandidate",
		candidate
	}),
	setVoter: (index: number, voter: Voter) => dispatch({
		type: "SetVoter",
		index,
		voter
	})
});

// STORE

export const { store, useStore } = createStore(reducer, initState());