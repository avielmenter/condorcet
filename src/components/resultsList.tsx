import * as React from 'react';
import { List, Map } from 'immutable';

import { useStore, mapDispatchToProps } from '../data/store';

import Voter from '../data/voter';
import Candidate from '../data/candidate';

import MainContent from './display/mainContent';
import StageHeader from './display/stageHeader';

type ComponentProps = {

}

const getTentativeAssignments = (
	candidates: List<Candidate>,
	voters: List<Voter>
): Map<Candidate, List<List<Voter>>> => candidates
	.reduce((prev, curr) => prev.set(curr, candidates
		.map((c, i) => voters
			.filter(v => v.preferences
				.get(i, { name: undefined }).name == c.name
			)
		)
	), Map<Candidate, List<List<Voter>>>());

const getConfirmedAssignments = (
	maxGroupSize: number,
	assignments: Map<Candidate, List<List<Voter>>>
): List<Voter> => assignments
	.valueSeq()
	.flatMap(vl => vl.get(0, List<Voter>()).count() <= maxGroupSize
		? vl.get(0, List<Voter>())
		: List<Voter>()
	).toList()

const filterConfirmedAssignments = (
	maxGroupSize: number,
	assignments: Map<Candidate, List<List<Voter>>>,
	confirmedAssignments: List<Voter> = getConfirmedAssignments(maxGroupSize, assignments)
): Map<Candidate, List<List<Voter>>> => assignments
	.map((vll, c) => vll
		.map((vl, i) => i == 0
			? vl
			: vl.filter(v => !confirmedAssignments.map(ca => ca.name).contains(v.name))
		)
	)

const getNextPreferences = (
	assignments: Map<Candidate, List<List<Voter>>>,
	confirmedAssignments: List<Voter>
): Map<Candidate, List<List<Voter>>> => assignments
	.map((vll, c) => vll
		.map((vl, i) => vl
			.map(v => confirmedAssignments.map(ca => ca.name).contains(v.name)
				? v
				: { ...v, preferences: v.preferences.skip(1).toList() }
			)
		)
	)

function getResults(
	candidates: List<Candidate>,
	voters: List<Voter>,
	assignments: Map<Candidate, List<List<Voter>>> = getTentativeAssignments(candidates, voters)
): Map<Candidate, List<Voter>> {
	return Map<Candidate, List<Voter>>();
}

const ResultsList: React.FunctionComponent<ComponentProps> = (props) => {
	const { state, actions } = useStore(
		(s) => ({ ...s, candidates: s.candidates.valueSeq().toList() }),
		mapDispatchToProps
	);

	const { candidates, voters } = state;

	const results = getResults(candidates, voters);

	return (
		<MainContent>
			<StageHeader>
				Results
			</StageHeader>
			{results.map((vs, c) =>
				<div>
					<h2 style={{ textAlign: "center" }}>
						{c.name}
					</h2>
					<ul>
						{vs.map(v =>
							<li>{v.name}</li>
						)}
					</ul>
				</div>
			)}
		</MainContent>
	)
}

export default ResultsList;