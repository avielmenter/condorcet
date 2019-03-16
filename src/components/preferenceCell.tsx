import * as React from 'react';
import { Map } from 'immutable';

import Voter from '../data/voter';
import Candidate from '../data/candidate';

import DropDown from './inputs/dropDown';

type ComponentProps = {
	candidates: Map<string, Candidate>,
	voter: Voter,
	setPreference: (candidateName: string) => void,
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

const PreferenceCell: React.SFC<ComponentProps> = (props) => (
	<td style={{ textAlign: "center", ...props.cellStyle }}>
		<DropDown
			options={getRemainingPreferences(props.candidates, props.voter)}
			onSelect={(_text, value) => props.setPreference(value)}
			selected={props.selected}
		/>
	</td>
);

export default PreferenceCell;