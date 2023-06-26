// Calculator Component
'use client';
import { useState, useRef } from "react";

import Button from "./button";
import Textbox from "./textbox";

function parseEquation(eq: string): string {

    // TODO: Implement Shunting Yard algo
    
    let build = '';

    for (let i = 0; i < eq.length; ++i) {

        if (eq.charAt(i) === '\u00F7')
            build += '/';
        else if (eq.charAt(i) === '\u00D7')
            build += '*';
        else
            build += eq.charAt(i);
    }

    return build;
}

function Calculator() {

    const bLabels: string[] = ['C', '()', '%', '\u00F7', '7', '8', '9', '\u00D7', '4', '5', '6', '-', '1', '2', '3', '+', '+/-', '0', '.', '='];
    
    const [value, setValue] = useState<string>('');
    const [numParenOpen, setNumParenOpen] = useState<number>(0);
    const [negative, setNegative] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const scrollToRight = () => {
        if (inputRef.current)
            inputRef.current.scrollLeft = inputRef.current.scrollWidth;
    }

    const handleClick = (value: string) => {

        const LOperators: string[] = ['%', '\u00F7', '\u00D7', '-', '+'];
        
        if (value === 'C') {
            setNumParenOpen(0);
            setNegative(false);
            setValue('');
        }
        else if(value === '()') {

            setNegative(false);

            setValue((pVal: string) => {

                if (numParenOpen === 0 || LOperators.includes(pVal[pVal.length - 1]) || pVal[pVal.length - 1] === '(') {
                    setNumParenOpen(numParenOpen + 1);

                    if (pVal[pVal.length - 1] === ')')
                        return pVal + '\u00D7' + '(';
                    else if (!Number.isNaN(Number(pVal[pVal.length - 1])))
                        return pVal + '\u00D7' + '(';
                        
                    return pVal + '(';
                }
                else if (numParenOpen > 0) {
                    setNumParenOpen(numParenOpen - 1);
                    return pVal + ')';
                }

                return pVal;
            });
        } 
        else if (value === '+/-') { 
            setValue((pVal: string) => {

                let nVal = pVal;
                if (nVal[nVal.length - 1] === ')') {
                    setNegative(true);
                    setNumParenOpen(numParenOpen + 1);
                    return nVal + '\u00D7(-';
                }

                let idx = nVal.length;
                while (idx > 0 && !LOperators.includes(nVal[idx - 1]) && nVal[idx - 1] !== '(')
                    --idx;

                if (negative) {
                    setNegative(false);
                    nVal = nVal.substring(0, idx - 2) + nVal.substring(idx, nVal.length);
                }
                else {
                    nVal = nVal.substring(0, idx) + '(-' + nVal.substring(idx, nVal.length);
                    setNegative(true);
                    setNumParenOpen(numParenOpen + 1);
                }

                return nVal;
            });
        }
        else if (LOperators.includes(value)) {                                  // Handles operator buttons
            
            setNegative(false);
            
            setValue((pVal: string) => {
                if (pVal.length === 0)
                    return '';
                else if (pVal[pVal.length - 1] === '(')
                    return pVal;
                else if (LOperators.includes(pVal[pVal.length - 1]))
                    return pVal.substring(0, pVal.length - 1) + value;
                else
                    return pVal + value;
            });
        } else if (value === '=') {
            setNegative(false);
            setValue((pVal: string) => eval(parseEquation(pVal)));
        }
        else {
            setValue((pVal: string) => {
                
                if (pVal[pVal.length - 1] === ')') {
                    setNegative(false);
                    return pVal + '\u00D7' + value;
                }

                return pVal + value;
            });
        }

        scrollToRight();
    };

    return (
        <div className='flex flex-col'>
            <Textbox value={value} innerRef={inputRef} />
            <div className='grid grid-cols-4 rounded-lg border border-gray-300'>
                {bLabels.map((label) => ( <Button key={label} value={label} onClick={handleClick} /> ))}
            </div>
        </div>
    );
}

export default Calculator;
