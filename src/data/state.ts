import { Map, List } from 'immutable';

import Candidate from './candidate';
import Voter from './voter';

export type Stage
	= "candidates"
	| "voters"
	| "results";

export default interface State {
	readonly candidates: Map<string, Candidate>,
	readonly voters: List<Voter>,
	readonly stage: Stage
}