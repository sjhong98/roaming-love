import { TestForm } from "@/components/ui/testForm.tsx";
import { QAFormType, Test1QAForm, Test2QAForm } from "@/constants/QAForm";
import { useState } from "react";

export default function Test2() {
	const [Test2Result, setTest2Result] = useState<QAFormType>(Test2QAForm);
	return (
		<TestForm
			form={Test2Result}
			setForm={setTest2Result}
		/>
	)
}