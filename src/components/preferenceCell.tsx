import * as React from 'react';
import { Map } from 'immutable';

import { useStore, mapDispatchToProps } from '../data/store';

import Voter from '../data/voter';
import Candidate from '../data/candidate';

import DropDown from './inputs/dropDown';

type ComponentProps = {
	voterIndex: number,
	preferenceIndex: number,
	selected?: string,
	cellStyle: React.CSSProperties
}

const getRemainingPreferences = (candidates: Map<string, Candidate>, voter: Voter) => candidates
	.filter(c => !(voter.preferences
		.flatMap(p => !p ? [] : [p.name])
		.contains(c.name))
	)
	.entrySeq()
	.map<[string, string]>(([k, c]) => [k, c.name])
	.toList();

const PreferenceCell: React.FunctionComponent<ComponentProps> = (props) => {
	const { state, actions } = useStore((s) => s, mapDispatchToProps);
	const { candidates, voters } = state;

	const { voterIndex, preferenceIndex } = props;

	const setPreference = (c: string) => {
		const voter = voters.get(voterIndex, undefined);
		const candidate = candidates.get(c, undefined);

		if (!voter || !candidate)
			return;

		actions.setVoter(voterIndex, {
			...voter,
			preferences: voter.preferences.set(preferenceIndex, candidate)
		});
	};

	const voter = voters.get(voterIndex, undefined);
	if (!voter)
		return (<div />);

	return (
		<td style={{ textAlign: "center", ...props.cellStyle }}>
			<DropDown
				options={getRemainingPreferences(candidates, voter)}
				onSelect={(_text, value) => setPreference(value)}
				selected={props.selected}
			/>
		</td>
	);
};

export default PreferenceCell;