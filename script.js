// ==========================================================================
        // JAVASCRIPT LOGIC TO POWER THE INTERACTIVE CHALLENGE
        // - This is the "engine" of the practice page. It checks your answers
        //   and applies the fixes if you are correct.
        // ==========================================================================
        document.addEventListener('DOMContentLoaded', () => {
            const allProblems = document.querySelectorAll('.problem-card');
            const totalProblems = allProblems.length;

            // This is our main controller. It listens for clicks on ANY "run-button".
            document.querySelector('main').addEventListener('click', (event) => {
                // We only care about clicks on elements with the 'run-button' class.
                if (event.target.classList.contains('run-button')) {
                    const problemCard = event.target.closest('.problem-card');
                    checkAnswer(problemCard);
                }
            });

            // This object defines the CSS rules that will be applied for the CSS challenges.
            const cssFixes = {
                '1': '{ background-color: var(--accent-1); }',
                '3': '{ border: 1px solid var(--accent-2); background-color: var(--accent-1); }',
                '5': '{ color: var(--success); }',
                '7': '{ background-color: var(--accent-2); color: white; border: 1px solid var(--highlight); }',
                '9': '{ border-left: 5px solid var(--highlight); }'
            };

            function checkAnswer(problemCard) {
                const problemId = problemCard.dataset.problemId;
                const problemType = problemCard.dataset.type;
                const solution = problemCard.dataset.solution;
                const userInput = problemCard.querySelector('.code-input').value.trim();
                const feedbackEl = problemCard.querySelector('.feedback');
                
                // We use a simplified check. For a real app, you'd want more robust validation.
                if (userInput === solution) {
                    feedbackEl.textContent = 'Correct!';
                    feedbackEl.style.color = 'var(--success)';

                    // If the answer is correct, apply the visual fix.
                    if (problemType === 'css') {
                        // For CSS, we create a new <style> tag and inject the rule.
                        const style = document.createElement('style');
                        const cssRule = userInput + ' ' + cssFixes[problemId];
                        style.textContent = cssRule;
                        document.head.appendChild(style);
                    } else if (problemType === 'js') {
                        // For JS, we use new Function() to safely execute the user's code.
                        // This is safer than eval().
                        try {
                            new Function(userInput)();
                        } catch (e) {
                            feedbackEl.textContent = `Correct code, but it caused an error: ${e.message}`;
                            feedbackEl.style.color = 'var(--highlight)';
                            return; // Stop if the correct code has an error
                        }
                    }

                    // Mark the problem as solved and disable the controls.
                    problemCard.classList.add('solved');
                    problemCard.querySelector('.code-input').disabled = true;
                    problemCard.querySelector('.run-button').disabled = true;

                    // Check if all problems have been solved.
                    checkCompletion();

                } else {
                    feedbackEl.textContent = 'Not quite, try again!';
                    feedbackEl.style.color = 'var(--highlight)';
                }
            }
            
            function checkCompletion() {
                const solvedCount = document.querySelectorAll('.problem-card.solved').length;
                if (solvedCount === totalProblems) {
                    document.body.classList.add('all-solved');
                    document.getElementById('main-title').textContent = 'Congratulations! Page Complete!';
                }
            }
        });