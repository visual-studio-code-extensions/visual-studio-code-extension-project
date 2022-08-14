export interface BlockAnalysis {
    localVariables: {
        name: string;
        // location: CodeLocation

        /**
         * means that it shares the name of a variable in and earlier block
         */
        shadows: boolean;
    }[];

    referencedVariables: {
        name: string;
        // location: CodeLocation
        block: number; // blocks above the current block parent number
    };
}

/*
{
    const shadow = 1;
    const ref = 5
    {
        const shadow = 2 + ref;
    }
}

*/
