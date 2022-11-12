interface Props {
  argument1: number;
  argument2?: number;
}

const useLibrary = ({ argument1, argument2 = 0 }: Props) => {
  if (!argument1) throw Error("argument 1 not specified");
  return {
    something: argument1 + argument2,
  };
};

export default useLibrary;
