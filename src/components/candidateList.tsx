import * as React from 'react';
import { List, Map } from 'immutable';

import Candidate from '../data/candidate';

import CandidateRow from './candidateRow';

import Button from './inputs/button';
import TextInput from './inputs/textInput';
import DropDown from './inputs/dropDown';

import MainContent from './display/mainContent';
import StageHeader from './display/stageHeader';

type ComponentProps = {
	candidates: Map<string, Candidate>,
	setCandidates: ((candidates: Map<string, Candidate>) => void)
};

const CandidateList: React.SFC<ComponentProps> = (props) => {
	const { candidates, setCandidates } = props;
	const [newCandidate, setNewCandidate] = React.useState("");

	const addCandidate = () => {
		if (newCandidate == "")
			return;

		setCandidates(candidates.set(newCandidate, { name: newCandidate }));
		setNewCandidate("");
	};

	const removeCandidate = (c: Candidate) => () => setCandidates(candidates.remove(c.name));

	return (
		<MainContent>
			<StageHeader>
				Enter the List of Options
			</StageHeader>
			<div style={{
				display: "flex",
				flexDirection: "column",
				width: "4in",
				marginRight: "auto",
				marginLeft: "auto"
			}}>
				{candidates.valueSeq().map((c, i) =>
					<CandidateRow
						key={'__candidate_' + i}
						candidate={c}
						removeCandidate={removeCandidate(c)}
					/>
				)}
			</div>
			<br />
			<div style={{ textAlign: "center" }}>
				<span style={{
					width: "2.5in",
					display: "inline-block",
					marginRight: "1ch",
					borderBottom: "1px solid darkgray"
				}}>
					<TextInput
						placeholder="Candidate Name"
						value={newCandidate}
						onChange={(event) => event.target && setNewCandidate((event.target as HTMLInputElement).value)}
						onKeyDown={(event) => {
							if (event.key.toLowerCase() == "enter" || event.key.toLowerCase() == "return")
								addCandidate();
						}}
						autoFocus={true}
					/>
				</span>
				<Button
					style="filled"
					onClick={addCandidate}
					icon="add"
					iconColor="var(--eton-blue)"
				/>
			</div>
		</MainContent>
	);
}

export default CandidateList;