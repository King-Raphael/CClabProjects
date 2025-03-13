class Polynomial:
    def __init__(self, coeffs):
        """
        coeffs[i] is the coefficient for x^i.
        Example: [5, 4, 0, 2, 1] corresponds to:
                 5 + 4x + 0x^2 + 2x^3 + 1x^4
        """
        # Make a copy of the list to avoid external modification
        self.coeffs = coeffs[:]

    def evaluate_at(self, x):
        """
        Evaluate the polynomial at the given value of x.
        """
        total = 0
        for i, coef in enumerate(self.coeffs):
            total += coef * (x ** i)
        return total

    def __iadd__(self, other):
        """
        In-place addition of another Polynomial.
        Adjusts the current Polynomial's coefficients by
        adding in the other Polynomial's coefficients.
        """
        # If other is not a Polynomial, we could raise a TypeError,
        # but for this example, we assume correct usage.
        
        # Extend self.coeffs if other has more terms
        max_len = max(len(self.coeffs), len(other.coeffs))
        if len(self.coeffs) < max_len:
            self.coeffs.extend([0] * (max_len - len(self.coeffs)))
        
        # Add coefficients
        for i in range(len(other.coeffs)):
            self.coeffs[i] += other.coeffs[i]
            
        return self

    def __str__(self):
        """
        Return a string representation of the polynomial in standard
        mathematical form. For example, [5, 4, 0, 2, 1] becomes:
        '1x^4 + 2x^3 + 4x + 5'
        """
        # Build terms from highest degree to 0
        terms = []
        # We'll go backwards to print highest powers first
        for power in reversed(range(len(self.coeffs))):
            coef = self.coeffs[power]
            if coef == 0:
                continue  # Skip zero coefficients entirely
            # Determine how to print the power of x
            if power == 0:
                # Just the coefficient
                terms.append(str(coef))
            elif power == 1:
                # e.g. '3x' or '-2x'
                if coef == 1:
                    terms.append("x")
                elif coef == -1:
                    terms.append("-x")
                else:
                    terms.append(f"{coef}x")
            else:
                # e.g. '2x^3'
                if coef == 1:
                    terms.append(f"x^{power}")
                elif coef == -1:
                    terms.append(f"-x^{power}")
                else:
                    terms.append(f"{coef}x^{power}")

        # Join the terms with " + ", then replace any "+ -" with "- "
        polynomial_str = " + ".join(terms)
        polynomial_str = polynomial_str.replace("+ -", "- ")

        # Handle the case where all coefficients might be zero
        if not polynomial_str:
            polynomial_str = "0"

        return polynomial_str

# ------------------------- 
# Demo / usage example
# -------------------------
if __name__ == "__main__":
    p1 = Polynomial([5, 4, 0, 2, 1])   # 5 + 4x + 0x^2 + 2x^3 + 1x^4
    p2 = Polynomial([1, 2, 3])        # 1 + 2x + 3x^2

    print("p1(x) =", p1)              # Prints: 1x^4 + 2x^3 + 4x + 5
    print("p2(x) =", p2)              # Prints: 3x^2 + 2x + 1

    # Evaluate at a given x
    x_value = 2
    print(f"p1({x_value}) =", p1.evaluate_at(x_value))  # Evaluate at x=2
    print(f"p2({x_value}) =", p2.evaluate_at(x_value))

    # In-place addition p1 += p2
    p1 += p2
    print("After p1 += p2, p1(x) =", p1)
