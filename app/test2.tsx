import { TestForm } from "@/components/ui/testForm.tsx";
import { QAFormType, Test1QAForm, Test2QAForm } from "@/constants/QAForm";
import { useEffect, useState } from "react";

export default function Test2() {
	const [Test2Result, setTest2Result] = useState<QAFormType>(Test2QAForm);

	// 진입할 때 선택 항목 초기화
	useEffect(() => {
		const resetForm = () => {
			// 깊은 복사하여 초기화
			const resetFormData: QAFormType = {
				...Test2QAForm,
				chapters: Test2QAForm.chapters.map(chapter => ({
					...chapter,
					questions: chapter.questions.map(question => ({
						...question,
						answers: question.answers.map(answer => ({
							...answer,
							selected: null
						}))
					}))
				})),
				resultTypes: Object.keys(Test2QAForm.resultTypes).reduce((acc, key) => {
					acc[key] = {
						...Test2QAForm.resultTypes[key],
						score: 0
					};
					return acc;
				}, {} as QAFormType['resultTypes'])
			};
			setTest2Result(resetFormData);
		};

		resetForm();
	}, []);
	
	return (
		<TestForm
			form={Test2Result}
			setForm={setTest2Result}
		/>
	)
}