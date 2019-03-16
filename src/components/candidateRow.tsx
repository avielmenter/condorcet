import * as React from 'react';

import MaterialIcon from './util/materialIcon';
import Button from './inputs/button';
import Candidate from '../data/candidate';

type ComponentProps = {
	candidate: Candidate,
	removeCandidate: () => void
}

const CandidateRow: React.FunctionComponent<ComponentProps> = (props) => {
	return (
		<div style={{
			width: "100%",
			display: "flex",
			borderBottom: "1px solid #FFFFFF22",
			paddingTop: "2pt",
			paddingBottom: "2pt"
		}}>
			<div style={{ flex: 1, paddingTop: "0.5em" }}>
				{props.candidate.name}
			</div>
			<Button onClick={props.removeCandidate} icon="clear" iconColor="red" style="filled" />
		</div>
	);
}

export default CandidateRow;