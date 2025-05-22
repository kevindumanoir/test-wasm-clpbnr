:- use_module(clpBNR/clpBNR).

pmt_end. % 0 in Excel
pmt_beginning. % 1 in Excel

pmt(RATE, NPeriod, PV, FV, pmt_end, Result) :-
    { 
        PVIF == (1 + RATE) ** NPeriod,
        Result == -1 * RATE * ( PV * PVIF + FV ) / (PVIF - 1)
    }.

% With prolog and clp(BNR), PMT can be inverted and used to calculate the interest rate :
% Rate::real, pmt(Rate / 12, 24, -75000, 0, pmt_end, 3240), { Rate >= 0.01 }, solve(Rate).
