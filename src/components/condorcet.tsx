import * as React from 'react';

import { useStore, mapDispatchToProps, getPrevStage, getNextStage, getFriendlyStageName } from '../data/store';

import CandidateList from '../components/candidateList';
import VoterPreferences from '../components/voterPreferences';
import ResultsList from '../components/resultsList';

import Button from '../components/inputs/button';

type ComponentProps = {

}

const App: React.FunctionComponent<ComponentProps> = (props) => {
	const { state, actions } = useStore((s) => s, mapDispatchToProps);

	const prevStage = getPrevStage(state.stage);
	const nextStage = getNextStage(state.stage);

	return (
		<div style={{
			background: "var(--outer-space)",
			width: "calc(100% - 2in)",
			marginLeft: "1in",
			marginRight: "1in"
		}}>
			{state.stage == "candidates" && <CandidateList />}
			{state.stage == "voters" && <VoterPreferences />}
			{state.stage == "results" && <ResultsList />}
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
						text={getFriendlyStageName(prevStage)}
						icon="arrow_back_ios"
						style="underline"
						onClick={actions.prevStage}
					/>}
				</div>
				<div style={{ flex: 1, textAlign: "right" }}>
					{nextStage && <Button
						text={getFriendlyStageName(nextStage)}
						icon="arrow_forward_ios"
						style="underline"
						iconAlign="right"
						onClick={actions.nextStage}
					/>}
				</div>
			</div>
		</div>
	);
}

export default App;