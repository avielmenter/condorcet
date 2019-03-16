import * as React from 'react';
import { List, Map } from 'immutable';

import Candidate from '../data/candidate';
import Voter, { initVoter } from '../data/voter';

import Button from './inputs/button';
import TextInput from './inputs/textInput';

import StageHeader from './display/stageHeader';
import MainContent from './display/mainContent';

import PreferenceRow from './preferenceRow';

type ComponentProps = {
	candidates: Map<string, Candidate>,
	voters: Voter[],
	setVoter: (i: number, v: Voter) => void
}

const VoterPreferences: React.SFC<ComponentProps> = (props) => {
	const { candidates, voters, setVoter } = props;
	const [newVoter, setNewVoter] = React.useState("");

	const addVoter = () => {
		setVoter(voters.length, initVoter(newVoter));
		setNewVoter("");
	};

	const setVoterSelection = (v: number, p: number, c: string) => {
		const voter = v >= voters.length ? undefined : voters[v];
		const candidate = candidates.get(c, undefined);

		if (!voter || !candidate)
			return;

		setVoter(v, {
			...voter,
			preferences: voter.preferences.set(p, candidate)
		});
	};

	const width = (100.0 / (candidates.count() + 1)) + "%";

	const allBorderStyle: React.CSSProperties = {
		borderBottom: "1px solid var(--gainsboro)",
		padding: "8pt",
		verticalAlign: "middle"
	};

	const mainBorderStyle: React.CSSProperties = {
		...allBorderStyle,
		borderLeft: "1px solid gray"
	};

	return (
		<MainContent>
			<StageHeader>
				Individual Preferences
			</StageHeader>
			<table style={{
				width: "100%",
				paddingLeft: "0.5in",
				paddingRight: "0.5in",
				fontSize: "12pt",
				borderCollapse: "collapse"
			}}>
				<thead style={{ fontWeight: "bold" }}>
					<tr>
						<td style={{ textAlign: "right", width, ...allBorderStyle }}>
							Voter
						</td>
						{candidates.keySeq().map((c, i) =>
							<td
								style={{ textAlign: "center", width, ...mainBorderStyle }}
								key={"__candidate_header_" + i}
							>
								{i + 1}
							</td>
						)}
					</tr>
				</thead>
				<tbody>
					{voters.map((v, i) =>
						<PreferenceRow
							key={"__voter_" + i}
							voter={v}
							candidates={candidates}
							even={i % 2 == 0}
							cellStyle={{ ...allBorderStyle, width }}
							setPreferences={(p, candidateName) => setVoterSelection(i, p, candidateName)}
						/>
					)}
				</tbody>
			</table>
			<div style={{ textAlign: "center" }}>
				<span style={{
					width: "2.5in",
					display: "inline-block",
					marginRight: "1ch",
					marginTop: "1em",
					borderBottom: "1px solid darkgray"
				}}>
					<TextInput
						placeholder="Voter Name"
						value={newVoter}
						onChange={(event) => event.target && setNewVoter((event.target as HTMLInputElement).value)}
						onKeyDown={(event) => {
							if (event.key.toLowerCase() == "enter" || event.key.toLowerCase() == "return")
								addVoter();
						}}
						autoFocus={true}
					/>
				</span>
				<Button
					style="filled"
					onClick={addVoter}
					icon="add"
					iconColor="var(--eton-blue)"
				/>
			</div>
		</MainContent>
	)
};

export default VoterPreferences;