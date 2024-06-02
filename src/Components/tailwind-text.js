import tw from "twin.macro";

export { HeaderText, SubheaderText, FormLabel, FormInput };

const HeaderText = tw.h1`mt-3 text-3xl font-extrabold tracking-tight text-slate-900`;
const SubheaderText = tw.h2`text-base font-semibold leading-7 text-gray-900`;

const FormLabel = tw.label`block text-sm font-medium leading-6 text-gray-900`;
const FormInput = tw.input`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`;




