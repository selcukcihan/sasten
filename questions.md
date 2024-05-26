I'm creating a quiz game for software developers. Each question will have 4 options of which 1 of them is the correct answer.
Create 5 such questions for me, presented as a json of the following form. An example:

{
  "date": "2024-05-25",
  "pk": "QUIZ#2024-05-25",
  "questions": [
    {
      "answer": 3,
      "options": [
        "Java",
        "Python",
        "C++",
        "JavaScript"
      ],
      "question": "Which programming language is primarily used for web development and runs in the browser?"
    },
    {
      "answer": 0,
      "options": [
        "Hypertext Markup Language",
        "Home Tool Markup Language",
        "Hyperlinking Text Marking Language",
        "Hypertext Management Language"
      ],
      "question": "What does HTML stand for?"
    },
    {
      "answer": 2,
      "options": [
        "int",
        "list",
        "str",
        "dict"
      ],
      "question": "In Python, which data type is used to represent text?"
    },
    {
      "answer": 1,
      "options": [
        "Branch",
        "Fork",
        "Merge",
        "Commit"
      ],
      "question": "In Git, what is the term used for creating a personal copy of someone else's project?"
    },
    {
      "answer": 3,
      "options": [
        "Agile",
        "Waterfall",
        "Kanban",
        "Scrum"
      ],
      "question": "Which Agile framework uses time-boxed iterations called sprints?"
    }
  ],
  "sk": "QUIZ"
}
