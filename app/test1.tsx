import { TestForm } from "@/components/ui/testForm.tsx";
import { QAFormType, Test1QAForm } from "@/constants/QAForm";
import { useEffect, useState } from "react";

export default function Test1() {
	const [Test1Result, setTest1Result] = useState<QAFormType>(Test1QAForm);

	// 진입할 때 선택 항목 초기화
	useEffect(() => {
		const resetForm = () => {
			// 깊은 복사하여 초기화
			const resetFormData: QAFormType = {
				...Test1QAForm,
				chapters: Test1QAForm.chapters.map(chapter => ({
					...chapter,
					questions: chapter.questions.map(question => ({
						...question,
						answers: question.answers.map(answer => ({
							...answer,
							selected: null
						}))
					}))
				})),
				resultTypes: Object.keys(Test1QAForm.resultTypes).reduce((acc, key) => {
					acc[key] = {
						...Test1QAForm.resultTypes[key],
						score: 0
					};
					return acc;
				}, {} as QAFormType['resultTypes'])
			};
			setTest1Result(resetFormData);
		};

		resetForm();
	}, []);

	return (
		<TestForm
			form={Test1Result}
			setForm={setTest1Result}
		/>
	)
}