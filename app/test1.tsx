import { TestForm } from "@/components/ui/testForm.tsx";
import { QAFormType, Test1QAForm } from "@/constants/QAForm";
import { useState } from "react";

export default function Test1() {
	const [Test1Result, setTest1Result] = useState<QAFormType>(Test1QAForm);
	return (
		<TestForm
			form={Test1Result}
			setForm={setTest1Result}
		/>
	)
}