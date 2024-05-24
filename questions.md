I'm creating a quiz game for software developers. Each question will have 4 options of which 1 of them is the correct answer.
Create 5 such questions for me, presented as a json of the following form. An example:

{
 "questions": [
  {
   "answer": 1,
   "options": [
    "Bubble Sort",
    "Quick Sort",
    "Insertion Sort",
    "Selection Sort"
   ],
   "question": "Which sorting algorithm has an average time complexity of O(n log n)?"
  },
  {
   "answer": 2,
   "options": [
    "Insert data into a table",
    "Delete data from a table",
    "Retrieve data from a table",
    "Update data in a table"
   ],
   "question": "What is the primary purpose of a SQL SELECT statement?"
  },
  {
   "answer": 0,
   "options": [
    "Transmission Control Protocol",
    "Time Control Protocol",
    "Transport Connection Protocol",
    "Technical Communication Protocol"
   ],
   "question": "In networking, what does TCP stand for?"
  }
 ]
}
