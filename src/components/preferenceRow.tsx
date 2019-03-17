import * as React from 'react';
import { Map } from 'immutable';

import Voter from '../data/voter';
import Candidate from '../data/candidate';

import PreferenceCell from './preferenceCell';

type ComponentProps = {
	voterIndex: number,
	voter: Voter,
	candidates: Map<string, Candidate>,
	even: boolean,
	cellStyle: React.CSSProperties
}

const PreferenceRow: React.FunctionComponent<ComponentProps> = (props) => {
	const { voter } = props;

	return (
		<tr style={{
			backgroundColor: props.even ? "#FFFFFF11" : "none"
		}}>
			<td style={{ textAlign: "right", wordWrap: "break-word", ...props.cellStyle }}>
				{voter.name}
			</td>
			{props.candidates.keySeq().map((_c, i) =>
				<PreferenceCell
					key={"__preference__" + i}
					voterIndex={props.voterIndex}
					preferenceIndex={i}
					selected={voter.preferences.map(p => p && p.name).get(i, undefined)}
					cellStyle={{ ...props.cellStyle, borderLeft: "1px solid gray" }}
				/>
			)}
		</tr>
	);
};

export default React.memo(
	PreferenceRow,
	(prev, next) => prev.voter.preferences.equals(next.voter.preferences)
);