// #!/usr/bin/env node
import inquirer from 'inquirer';
import chalk, { Chalk } from 'chalk';



class Person {
    name: string;
    age: number;
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
    getName() { return this.name; }
}

class Course {
    static id: number = 0;
    static getFreshIndex(): number
    {
        Course.id += 1;
        return Course.id; 
    }
    id: number = Course.getFreshIndex();
    name: string;
    students: Student[] = [];
    instructor!: Instructor;
    constructor( name: string) {
        this.name = name;
    }
    addStudent(student: Student) { 
        this.students.push(student)
    };
    setInstructor(instructor: Instructor) {this.instructor = instructor};
}

class Department {
    static id: number = 0;
    static getFreshIndex(): number
    {
        Department.id += 1;
        return Department.id; 
    }
    id: number = Department.getFreshIndex();
    name: string;
    courses:Course[] = [];
    constructor(name: string) {this.name = name}
    addCourse(course: Course) {
        this.courses.push(course)
    }

}


class Student extends Person {
    static id: number = 0;
    static getFreshIndex(): number
    {
        Student.id += 1;
        return Student.id; 
    }
    id: number = Student.getFreshIndex();
    rollNumber: string;
    courses: Course[] = [];
    constructor(name: string,age: number,rollNumber: string) {
        super(name,age);
        this.rollNumber = rollNumber
    }
    registerForCourse(course:Course) {
        this.courses.push(course);
    }
}

class Instructor extends Person {
    static id: number = 0;
    static getFreshIndex(): number
    {
        Instructor.id += 1;
        return Instructor.id; 
    }
    id: number = Instructor.getFreshIndex();
    salary: number;
    courses: Course[] = [];
    constructor(name: string,age: number, salary: number) {
        super(name,age)
        this.salary = salary;
    }
    assignCourse(course: Course) {
        this.courses.push(course);
    }
}

const studentsList:Student[] = [];
const instructorList: Instructor[] = [];
const courseList: Course[] = [];
const departmentList: Department[] = [];

const handleAddStudent = async () => {
    const addStudent = await inquirer.prompt([
        {
            type: "string",
            name:"name",
            message: "Please enter student name",
        },
        {
            type: "number",
            name: "age",
            message:"Please enter student age",
        },
        {
            type: "string",
            name:"rollNumber",
            message:"Please enter student roll number"
        }
    ])

    const {name, age, rollNumber} = addStudent;
    const student = new Student(name,age,rollNumber);
    studentsList.push(student);
    console.log(chalk.green('Add Student Successfully'));
    continueProgramHandler();
}

const handleRegisterCourseToStudent = async () => {
    let courseSelected;
    let studentSelected;
    if(studentsList.length) {
        const selectedStudent = await inquirer.prompt([
            {
            type:"list",
            name:"student",
            message:"Please select student to add to course",
            choices: studentsList.map(item => `ID: ${item.id}, Name: ${item.name}`)
            }
    ])
        const { student } = selectedStudent;
        studentSelected = student;

    } else {
        console.log(chalk.red("There is no student in list, please add student first"));
        continueProgramHandler();
        return
    }
    if(courseList.length) {
        const selectedCourse = await inquirer.prompt([
            {
            type:"list",
            name:"course",
            message:"Please select course to add a student",
            choices: courseList.map(item => `ID: ${item.id}, Name: ${item.name}`)
            }
    ])
        const { course } = selectedCourse;
        courseSelected = course

    } else {
        console.log(chalk.red("There is no course in list, please add course first"));
        continueProgramHandler();
        return;
    }


    if(courseSelected && studentSelected) {
        const findStudentId = Number(studentSelected.split(" ")[1][0])
        const findCourseId = Number(courseSelected.split(" ")[1][0])
        const studentIndex = studentsList.findIndex(item => item.id === findStudentId);
        const courseIndex = courseList.findIndex(item => item.id === findCourseId);
        studentsList[studentIndex].registerForCourse(courseList[courseIndex])
    } else {
        console.log(chalk.red("Something when wrong!"));
    }
    console.log(chalk.green('Register Course Successfully'));
    continueProgramHandler();
}

const handleShowStudentList = () => {
    console.log(studentsList);
    continueProgramHandler();
}

const handleAddInstructor = async () => {
    const addInstructor = await inquirer.prompt([
        {
            type: "string",
            name:"name",
            message:"Please enter instructor name"
        },
        {
            type: "number",
            name: "age",
            message:"Please enter instructor age",
        },
        {
            type: "number",
            name: "salary",
            message:"Please enter instructor salary",
        }
    ])
    const {name, age, salary} = addInstructor;
    const instructor = new Instructor(name,age,salary);
    instructorList.push(instructor)
    console.log(chalk.green('Add Instructor Successfully'));
    continueProgramHandler();
}

const handleAssignCourseToInstructor = async () => {
    let courseSelected;
    let instructorSelected;
    if(instructorList.length) {
        const selectedInstructor = await inquirer.prompt([
            {
            type:"list",
            name:"instructor",
            message:"Please select instructor to add to course",
            choices: instructorList.map(item => `ID: ${item.id}, Name: ${item.name}`)
            }
    ])
        const { instructor } = selectedInstructor;
        instructorSelected = instructor;

    } else {
        console.log(chalk.red("There is no instructor in list, please add instructor first"));
        continueProgramHandler();
        return
    }
    if(courseList.length) {
        const selectedCourse = await inquirer.prompt([
            {
            type:"list",
            name:"course",
            message:"Please select course to add a student",
            choices: courseList.map(item => `ID: ${item.id}, Name: ${item.name}`)
            }
    ])
        const { course } = selectedCourse;
        courseSelected = course

    } else {
        console.log(chalk.red("There is no course in list, please add course first"));
        continueProgramHandler();
        return;
    }


    if(courseSelected && instructorSelected) {
        const instructorId = Number(instructorSelected.split(" ")[1][0])
        const findCourseId = Number(courseSelected.split(" ")[1][0])
        const instructorIndex = instructorList.findIndex(item => item.id === instructorId);
        const courseIndex = courseList.findIndex(item => item.id === findCourseId);
        instructorList[instructorIndex].assignCourse(courseList[courseIndex])
    } else {
        console.log(chalk.red("Something when wrong!"));
    }
    console.log(chalk.green('Assign Course Successfully'));
    continueProgramHandler();
}


const handleShowInstructorList = () => {
    console.log(instructorList);
    continueProgramHandler();
}

const handleAddCourse = async () => {
    const addCourse = await inquirer.prompt({
        name:"name",
        message:"Please enter course name"
    })
    const {name} = addCourse;
    const course = new Course(name);
    courseList.push(course);
    console.log(chalk.green('Add Course Successfully'));
    continueProgramHandler();
}

const handleShowCourseList = () => {
    console.log(courseList);
    continueProgramHandler();
}
const handleAddStudentToCourse = async () => {
    let courseSelected;
    let studentSelected;
    if(courseList.length) {
        const selectedCourse = await inquirer.prompt([
            {
            type:"list",
            name:"course",
            message:"Please select course to add a student",
            choices: courseList.map(item => `ID: ${item.id}, Name: ${item.name}`)
            }
    ])
        const { course } = selectedCourse;
        courseSelected = course

    } else {
        console.log(chalk.red("There is no course in list, please add course first"));
        continueProgramHandler();
        return;
    }
    if(studentsList.length) {
        const selectedStudent = await inquirer.prompt([
            {
            type:"list",
            name:"student",
            message:"Please select student to add to course",
            choices: studentsList.map(item => `ID: ${item.id}, Name: ${item.name}`)
            }
    ])
        const { student } = selectedStudent;
        studentSelected = student;

    } else {
        console.log(chalk.red("There is no student in list, please add student first"));
        continueProgramHandler();
        return
    }

    if(courseSelected && studentSelected) {
        const findStudentId = Number(studentSelected.split(" ")[1][0])
        const findCourseId = Number(courseSelected.split(" ")[1][0])
        const studentIndex = studentsList.findIndex(item => item.id === findStudentId);
        const courseIndex = courseList.findIndex(item => item.id === findCourseId);
        courseList[courseIndex].addStudent(studentsList[studentIndex])
    } else {
        console.log(chalk.red("Something when wrong!"));
    }
    console.log(chalk.green('Add Student into Course Successfully'));
    continueProgramHandler();
}

const handleSetInstructorToCourse = async () => {
    let courseSelected;
    let instructorSelected;
    if(courseList.length) {
        const selectedCourse = await inquirer.prompt([
            {
            type:"list",
            name:"course",
            message:"Please select course to add a instructor",
            choices: courseList.map(item => `ID: ${item.id}, Name: ${item.name}`)
            }
    ])
        const { course } = selectedCourse;
        courseSelected = course

    } else {
        console.log(chalk.red("There is no course in list, please add course first"));
        continueProgramHandler();
        return;
    }
    if(instructorList.length) {
        const selectedInstructor = await inquirer.prompt([
            {
            type:"list",
            name:"instructor",
            message:"Please select instructor to add to course",
            choices: instructorList.map(item => `ID: ${item.id}, Name: ${item.name}`)
            }
    ])
        const { instructor } = selectedInstructor;
        instructorSelected = instructor;

    } else {
        console.log(chalk.red("There is no instructor in list, please add instructor first"));
        continueProgramHandler();
        return
    }

    if(courseSelected && instructorSelected) {
        const findInstructorId = Number(instructorSelected.split(" ")[1][0])
        const findCourseId = Number(courseSelected.split(" ")[1][0])
        const instructorIndex = instructorList.findIndex(item => item.id === findInstructorId);
        const courseIndex = courseList.findIndex(item => item.id === findCourseId);
        courseList[courseIndex].setInstructor(instructorList[instructorIndex])
    } else {
        console.log(chalk.red("Something when wrong!"));
    }
    console.log(chalk.green('Set Instructor Successfully'));
    continueProgramHandler();

}

const handleAddDepartment = async () => {
const addDepartment: {name: string} = await inquirer.prompt(
    {
        name:"name",
        message: "Please enter department name",
    }
)
const {name} = addDepartment;
const department = new Department(name);
departmentList.push(department)
console.log(chalk.green('Add Department Successfully'));
continueProgramHandler();
}

const handleAddCourseToDepartment = async () => {
    let courseSelected;
    let departmentSelected;
    if(departmentList.length) {
        const selectedDepartment = await inquirer.prompt([
            {
            type:"list",
            name:"department",
            message:"Please select department to add to course",
            choices: departmentList.map(item => `ID: ${item.id}, Name: ${item.name}`)
            }
    ])
        const { department } = selectedDepartment;
        departmentSelected = department;

    } else {
        console.log(chalk.red("There is no department in list, please add department first"));
        continueProgramHandler();
        return
    }

    if(courseList.length) {
        const selectedCourse = await inquirer.prompt([
            {
            type:"list",
            name:"course",
            message:"Please select course to add a instructor",
            choices: courseList.map(item => `ID: ${item.id}, Name: ${item.name}`)
            }
    ])
        const { course } = selectedCourse;
        courseSelected = course

    } else {
        console.log(chalk.red("There is no course in list, please add course first"));
        continueProgramHandler();
        return;
    }


    if(courseSelected && departmentSelected) {
        const findDepartmentId = Number(departmentSelected.split(" ")[1][0])
        const findCourseId = Number(courseSelected.split(" ")[1][0])
        const departmentIndex = departmentList.findIndex(item => item.id === findDepartmentId);
        const courseIndex = courseList.findIndex(item => item.id === findCourseId);
        departmentList[departmentIndex].addCourse(courseList[courseIndex])
    } else {
        console.log(chalk.red("Something when wrong!"));
    }
    console.log(chalk.green('Add Course into department Successfully'));
    continueProgramHandler();
}

const handleShowDepartmentList = () => {
    console.log(departmentList);
    continueProgramHandler();
}

const continueProgramHandler = async () => {
    const question = await inquirer.prompt([
        {
            type:"list",
            name: "userSelection",
            message: "Please select option to perform actions",
            choices: ["Do you want to continue program","Exit Program"]
        }
    ]);
    const {userSelection} = question;
    switch(userSelection) {
        case "Do you want to continue program":
            StudentManagementSystem();
        break;
        case "Exit Program":
            console.log(chalk.green('Thank you for using student management system'));
    }
}

const StudentManagementSystem = async () => {
    const question = await inquirer.prompt([
        {
            type:"list",
            name: "userSelection",
            message: "Please select option to perform actions",
            choices: ["Add Student","Register Course to Student","Show Student List","Add Instructor","Assign course to instructor","Show Instructor List","Add Course","Add Student into Course", "Set Instructor into Course","Show Course List","Add Department","Add course into department","Show Department List","Exit Program"]
        }
    ]);

    const {userSelection} = question;
    switch(userSelection) {
        case "Add Student":
            handleAddStudent();
        break;
        case "Register Course to Student":
            handleRegisterCourseToStudent();
        break;
        case "Show Student List":
            handleShowStudentList();
        break;
        case "Add Instructor":
            handleAddInstructor();
        break;
        case "Assign course to instructor":
            handleAssignCourseToInstructor();
        break;
        case "Show Instructor List":
            handleShowInstructorList();
        break;
        case "Add Course":
            handleAddCourse();
        break;
        case "Add Student into Course":
            handleAddStudentToCourse();
        break;
        case "Set Instructor into Course":
            handleSetInstructorToCourse();
        break;
        case "Show Course List":
            handleShowCourseList();
        break;
        case "Add Department":
            handleAddDepartment();
        break;
        case "Add course into department":
            handleAddCourseToDepartment();
        break;
        case "Show Department List":
            handleShowDepartmentList();
        break;
        case "Exit Program":
            console.log(chalk.green('Thank you for using student management system'));
    }
}
StudentManagementSystem();