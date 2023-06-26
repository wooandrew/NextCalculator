// Calculator Component
'use client';
import { useState, useRef } from "react";

import Button from "./button";
import Textbox from "./textbox";

const LOperators: string[] = ['%', '\u00F7', '\u00D7', '-', '+'];

function parseEquation(eq: string): string {

    const nums: string[] = [];
    const ops: string[] = [];

    const calc: () => void = () => {

        const second: number = Number(nums.pop());
        const first: number = Number(nums.pop());

        const op = ops.pop();

        let solution: number = NaN;
        
        if (op === '\u00D7')                // Multiplication
            solution = first * second;
        else if (op === '\u00F7')           // Division
            solution = first / second;
        else if (op === '+')                // Addition
            solution = first + second;
        else if (op === '-')                // Subtraction
            solution = first - second;

        nums.push(String(solution));
    };

    const isNumber: (v: string) => boolean = (v: string) => v >= '0' && v <= '9';

    // Operator Precedence
    const opPrec: (v: string) => number = (v: string) => {

        if (v === '\u00D7' || v === '\u00F7')
            return 2;
        else if (v === '+' || v === '-')
            return 1;

        return 0;
    };

    // Shunting Yard algo
    for (let i = 0; i < eq.length; ++i) {

        if (isNumber(eq[i])) {

            if (i > 0 && isNumber(eq[i - 1]))
                nums[nums.length - 1] = nums[nums.length - 1] + eq[i];
            else
                nums.push(eq[i]);
        } 
        else if (LOperators.includes(eq[i])) {
                
            while (opPrec(eq[i]) < opPrec(ops[ops.length - 1]))
                calc();
            
            ops.push(eq[i]);
        }
        else if (eq[i] === '(') {
            ops.push(eq[i]);
        }
        else if (eq[i] === ')') {

            while (ops.length > 0 && ops[ops.length - 1] !== '(') {
                console.log(ops)
                calc();
            }

            ops.pop();
        } 
    }

    while (ops.length > 0)
        calc();

    return nums[nums.length - 1];
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
            setValue((pVal: string) => parseEquation(pVal));
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
