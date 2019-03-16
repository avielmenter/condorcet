import * as React from 'react';
import { Map } from 'immutable';

import Voter from '../data/voter';
import Candidate from '../data/candidate';

import PreferenceCell from './preferenceCell';

type ComponentProps = {
	voter: Voter,
	candidates: Map<string, Candidate>,
	setPreferences: (i: number, c: string) => void,
	even: boolean,
	cellStyle: React.CSSProperties
}

const PreferenceRow: React.SFC<ComponentProps> = (props) => (
	<tr style={{
		backgroundColor: props.even ? "#FFFFFF11" : "none"
	}}>
		<td style={{ textAlign: "right", wordWrap: "break-word", ...props.cellStyle }}>
			{props.voter.name}
		</td>
		{props.candidates.keySeq().map((_c, i) =>
			<PreferenceCell
				key={"__preference__" + i}
				candidates={props.candidates}
				voter={props.voter}
				setPreference={(candidateName: string) => props.setPreferences(i, candidateName)}
				selected={props.voter.preferences.map(p => p && p.name).get(i, undefined)}
				cellStyle={{ ...props.cellStyle, borderLeft: "1px solid gray" }}
			/>
		)}
	</tr>
);

export default React.memo(
	PreferenceRow,
	(prev, next) => prev.voter.preferences.equals(next.voter.preferences)
);