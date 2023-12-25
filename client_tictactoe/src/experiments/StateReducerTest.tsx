"use client";
import {
  FC,
  Fragment,
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

type CountState = {
  count: number;
};

enum CountActionTypes {
  INCREMENT = "INCREMENT",
  DECREMENT = "DECREMENT",
  INCREASE_BY = "INCREASE_BY",
  DECREASE_BY = "DEREASE_BY",
}

interface CountActionPayloads {
  [CountActionTypes.INCREMENT]: null;
  [CountActionTypes.DECREMENT]: null;
  [CountActionTypes.INCREASE_BY]: { by: number };
  [CountActionTypes.DECREASE_BY]: { by: number };
}

type CountAction = {
  type: CountActionTypes;
  payload: CountActionPayloads[CountActionTypes];
};

// --------------------------DEFINE REDUCER

const countReducer = (state: CountState, action: CountAction): CountState => {
  switch (action.type) {
    case CountActionTypes.INCREMENT:
      return {
        ...state,
        count: state.count + 1,
      };
    case CountActionTypes.DECREMENT:
      return {
        ...state,
        count: state.count - 1,
      };
    case CountActionTypes.INCREASE_BY:
      if (action.payload instanceof Object && "by" in action.payload)
        return {
          ...state,
          count: state.count + action.payload.by,
        };
    case CountActionTypes.DECREASE_BY:
      if (action.payload instanceof Object && "by" in action.payload)
        return {
          ...state,
          count: state.count - action.payload.by,
        };
    default:
      return state;
  }
};

// ------------- CONTEXTS WITH THEIR HOOKS
const CountContext = createContext<CountState | null>(null);

const useCountContext = () => {
  const context = useContext(CountContext);
  if (!context) {
    throw Error(" Count Context not initialized properly !");
  } else {
    return context;
  }
};

const CountDispatchContext = createContext<
  ((action: CountAction) => void) | null
>(null);
const useCountDispatchContext = () => {
  const context = useContext(CountDispatchContext);
  if (!context) {
    throw Error(" Count Context not initialized properly !");
  } else {
    return context;
  }
};

// ----------------------PROVIDER------------
interface CountProviderProps {
  children: React.ReactNode;
}
const CountProvider: FC<CountProviderProps> = ({ children }) => {
  const initialCountState: CountState = {
    count: 0,
  };

  const [countState, countDispatch] = useReducer(
    countReducer,
    initialCountState
  );
  return (
    <CountContext.Provider value={countState}>
      <CountDispatchContext.Provider value={countDispatch}>
        {children}
      </CountDispatchContext.Provider>
    </CountContext.Provider>
  );
};

// --------------CUSTOM FUNCTIONALITY HOOK
const useCountHook = () => {
  const countState = useCountContext();
  const countDispatch = useCountDispatchContext();
  const [countLoaded, setCountLoaded] = useState<boolean>(false);

  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current = renderCount.current+1;
    console.log("Rendered useCountHook for ", renderCount.current," times")
      console.log("Before timeout loading status - ",countLoaded)
    const initCountAsync = async () => {
      setTimeout(() => {
        countDispatch({
          type: CountActionTypes.INCREASE_BY,
          payload: {
            by: 100,
          },
        });
        setCountLoaded(true);
      console.log("After  timeout loading status - ",countLoaded)

      }, 3000);

    };
    initCountAsync();
    console.log("After function call in useffect loading status - ",countLoaded)

  }, []);

  const increment = () => {
    countDispatch({ type: CountActionTypes.INCREMENT, payload: null });
  };
  const decrement = () => {
    countDispatch({ type: CountActionTypes.DECREMENT, payload: null });
  };

  const increaseBy = (num: number) => {
    countDispatch({
      type: CountActionTypes.INCREASE_BY,
      payload: {
        by: num,
      },
    });
  };

  const decreaseBy = (num: number) => {
    countDispatch({
      type: CountActionTypes.DECREASE_BY,
      payload: {
        by: num,
      },
    });
  };

  return { countState, increment, decrement, increaseBy, decreaseBy,countLoaded };
};




// --------------------------------
interface StateReducerTestParentProps {}

export const StateReducerTestParent: FC<StateReducerTestParentProps> = ({}) => {
    useEffect(()=>{
        console.log("Ran StateReducer Test Parent")
    },[])
  return (
    <Fragment>
      <CountProvider>
        <StateReducerTest />
      </CountProvider>
    </Fragment>
  );
};



// --------------------------------------
interface StateReducerTestProps {}

const StateReducerTest: FC<StateReducerTestProps> = ({}) => {
  const { countState, increaseBy, decreaseBy, increment, decrement,countLoaded } =
    useCountHook();

    useEffect(()=>{
        console.log("Ran StateReducer Test")
    },[])
    console.log("Count load status ", countLoaded)

  const ref1 = useRef<HTMLInputElement | null>(null);
  const ref2 = useRef<HTMLInputElement | null>(null);

  return countLoaded  === true  ?   (
    <Fragment>
        <h1>Count loaded status : {countLoaded.toString()}</h1>
      <h3>Count is {countState.count}</h3>
      <button
        onClick={() => {
          increment();
        }}
      >
        Increment +
      </button>
      <button onClick={() => decrement()}>Decrement -</button>
      <div>
        <input type="number" ref={ref1} placeholder="Increase By" />
        <button
          onClick={() => {
            increaseBy(
              ref1.current?.value ? parseInt(ref1.current.value, 10) : 0
            );
          }}
        >
          Add By
        </button>
      </div>
      <div>
        <input type="number" ref={ref2} placeholder="Decrease By" />
        <button
          onClick={() => {
            decreaseBy(
              ref2.current?.value ? parseInt(ref2.current.value, 10) : 0
            );
          }}
        >
          Decrease by
        </button>
      </div>
    </Fragment>
  ) : (
    <Fragment>
        <h1>Count loaded status : {countLoaded.toString()}</h1>

      <h1>Loading... </h1>
    </Fragment>
  );
};

export default StateReducerTest;
