import * as React from 'react';

import { useStore, mapDispatchToProps } from '../data/store';

import CandidateRow from './candidateRow';

import Button from './inputs/button';
import TextInput from './inputs/textInput';

import MainContent from './display/mainContent';
import StageHeader from './display/stageHeader';

type ComponentProps = {

};

const CandidateList: React.FunctionComponent<ComponentProps> = (props) => {
	const { state: candidates, actions } = useStore((s) => s.candidates, mapDispatchToProps);
	const [newCandidate, setNewCandidate] = React.useState("");

	const add = () => {
		if (newCandidate == "")
			return;

		setNewCandidate("");
		actions.addCandidate(newCandidate);
	}

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
						removeCandidate={() => actions.removeCandidate(c)}
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
								add();
						}}
						autoFocus={true}
					/>
				</span>
				<Button
					style="filled"
					onClick={add}
					icon="add"
					iconColor="var(--eton-blue)"
				/>
			</div>
		</MainContent>
	);
}

export default CandidateList;