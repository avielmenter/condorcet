import Candidate from './candidate';

import { List } from 'immutable';

export default interface Voter {
	readonly name: string,
	readonly preferences: List<Candidate>
}

export const initVoter = (name: string) => ({
	name,
	preferences: List<Candidate>()
});