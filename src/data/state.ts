import { Map } from 'immutable';

import Candidate from './candidate';
import Voter from './voter';

export type Stage
	= "candidates"
	| "voters"
	| "results";

export default interface State {
	readonly candidates: Map<string, Candidate>,
	readonly voters: Voter[],
	readonly stage: Stage
}

export const initState: (() => State) = () => ({
	candidates: Map<string, Candidate>(),
	voters: [],
	stage: "candidates"
});

export function prevStage(curr: Stage): Stage | undefined {
	switch (curr) {
		case "candidates":
			return undefined;
		case "voters":
			return "candidates";
		case "results":
			return "voters";
	}
}

export function nextStage(curr: Stage): Stage | undefined {
	switch (curr) {
		case "candidates":
			return "voters";
		case "voters":
			return "results";
		case "results":
			return undefined;
	}
}

export function friendlyStageName(stage: Stage): string {
	switch (stage) {
		case "candidates":
			return "Set Options";
		case "voters":
			return "Individual Preferences";
		case "results":
			return "See Results";
	}
}