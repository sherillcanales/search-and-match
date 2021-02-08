import React, { useCallback, useState } from 'react';
import axios from 'axios';

import Pages from 'pages';
import ContactInfo, { ContactInfoState } from './ContactInfo';
import Questionnaire from './Questionnaire';
import Intro from './Intro';

import Questions from './questions';

const STAGE_INTRO = 'INTRO';
const STAGE_QUESTIONNAIRE = 'QUESTIONNAIRE';
const STAGE_CONTACT_INFO = 'CONTACT_INFO';
const STAGE_OUTRO = 'OUTRO';

type Stage = typeof STAGE_INTRO |
					typeof STAGE_QUESTIONNAIRE | 
					typeof STAGE_CONTACT_INFO |
					typeof STAGE_OUTRO;

const CreateProjectPage = () => {
	const [answersFromQuestionnaire, setAnswersFromQuestionnaire] = useState<any[][]>();
	const [currentStage, setCurrentStage] = useState<Stage>(STAGE_INTRO);

	const onQuestionnaireFinish = useCallback((answers: any[][]) => {
		setAnswersFromQuestionnaire(answers);
	}, []);

	const onContactInfoSubmit = useCallback((contactInfo: ContactInfoState) => {
		const finalAnswers = answersFromQuestionnaire?.map((answers, index) => {
			const Question = Questions[index];
			const chosenOptions = answers.map(answer => Question.options.find(option => option.id === answer)?.text)
			return {
				question: Question.question,
				answers: chosenOptions
			}
		});

		const data = {
			"contact": {
				...contactInfo
			},
			"questions": finalAnswers
		};

		axios.post('https://www.skyfarms.io/search-and-match/index.php', { data })
			.then(res => {
				console.log("response here: ", res)
				console.log("res data: ", res.data);
			})
			.catch(err => {
				console.error("error in post: ", err);
			});
	}, [answersFromQuestionnaire]);

	return (
		<Pages>
			{(() => {
				switch (currentStage) {
					case STAGE_INTRO:
						return <Intro onFinish={() => {console.log("intro has finished")}} />;
					case STAGE_QUESTIONNAIRE:
						return <Questionnaire questions={Questions} onFinish={onQuestionnaireFinish} />;
					case STAGE_CONTACT_INFO:
						return <ContactInfo onSubmit={onContactInfoSubmit} />;
					case STAGE_OUTRO:
					default: 
						return null;
				}
			})()}
		</Pages>
	);
};

export default CreateProjectPage;