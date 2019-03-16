import * as React from 'react';
import { Map } from 'immutable';

import * as State from './data/state';
import Candidate from './data/candidate';
import Voter from './data/voter';

import CandidateList from './components/candidateList';
import VoterPreferences from './components/voterPreferences';
import ResultsList from './components/resultsList';

import Button from './components/inputs/button';

type ComponentProps = {

}

const App: React.FunctionComponent<ComponentProps> = (props) => {
	const [state, setState] = React.useState(State.initState());

	const setCandidates = (candidates: Map<string, Candidate>) => {
		if (candidates.equals(state.candidates))
			return;

		setState({
			voters: [],
			candidates,
			stage: state.stage
		});
	}

	const setVoter = (i: number, v: Voter) => {
		state.voters[i] = v;
		setState({ ...state, voters: state.voters });
	}

	const setStage = (stage: State.Stage) => setState({ ...state, stage });

	const prevStage = State.prevStage(state.stage);
	const nextStage = State.nextStage(state.stage);

	return (
		<div style={{
			background: "var(--outer-space)",
			width: "calc(100% - 2in)",
			marginLeft: "1in",
			marginRight: "1in"
		}}>
			{state.stage == "candidates" &&
				<CandidateList setCandidates={setCandidates} candidates={state.candidates} />
			}
			{state.stage == "voters" &&
				<VoterPreferences setVoter={setVoter} candidates={state.candidates} voters={state.voters} />
			}
			{state.stage == "results" &&
				<ResultsList voters={state.voters} candidates={state.candidates.valueSeq().toList()} />
			}
			<div style={{
				display: "flex",
				flexDirection: "row",
				color: "#0CF",
				fontSize: "16pt",
				paddingBottom: "0.5em",
				width: "calc(100% - 1in)",
				marginLeft: "auto",
				marginRight: "auto",
				borderTop: "1px solid var(--shiny-shamrock)"
			}}>
				<div style={{ flex: 1, textAlign: "left" }}>
					{prevStage && <Button
						text={State.friendlyStageName(prevStage)}
						icon="arrow_back_ios"
						style="underline"
						onClick={() => setStage(prevStage)}
					/>}
				</div>
				<div style={{ flex: 1, textAlign: "right" }}>
					{nextStage && <Button
						text={State.friendlyStageName(nextStage)}
						icon="arrow_forward_ios"
						style="underline"
						iconAlign="right"
						onClick={() => setStage(nextStage)}
					/>}
				</div>
			</div>
		</div>
	);
}

export default App;