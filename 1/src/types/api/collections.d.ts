declare namespace Collections {
	type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'

	interface Lesson {
		cabinet: string
		discipline: Discipline | null
		teacher: Teacher | null
		id: string
	}

	interface Schedule {
		id: string
		monday: Lesson[]
		tuesday: Lesson[]
		wednesday: Lesson[]
		thursday: Lesson[]
		friday: Lesson[]
	}

	interface Group {
		id: string
		name: string
		teacher: Teacher | null
		students: Student[]
		schedule: Schedule
		createdAt: string
		updatedAt: string
	}

	type GroupedCourses = Array<[string, Group[]]>

	interface SimpleGroup {
		id: string
		name: string
		createdAt: string
		updatedAt: string
	}

	interface TeachingGroup {
		id: string
		name: string
		createdAt: string
		updatedAt: string
		chat: {
			id: string
			groupId: string
			createdAt: string
			updatedAt: string
		}
	}

	interface Teacher {
		id: string
		name: string
		email: string
		disciplines: Discipline[]
		group: SimpleGroup | null
		createdAt: string
		updatedAt: string
		teachingGroups: TeachingGroup[]
	}

	interface Student {
		id: string
		name: string
		email: string
		group: SimpleGroup | null
		birthDate?: string
		phone?: string
		createdAt: string
		updatedAt: string
	}

	interface Discipline {
		name: string
		id: string
		createdAt: string
		updatedAt: string
	}

	interface Admin {
		id: string
		name: string
		email: string
		createdAt: string
		updatedAt: string
	}

	interface SenderMessage {
		email: string
		id: string
		name: string
		phone: string | null
	}

	export type SenderType = 'student' | 'teacher' | 'system'

	interface Message {
		text: string
		createdAt: string
		sender: SenderMessage
		senderType: SenderType
	}

	interface Chat {
		id: string
		groupId: string
		createdAt: string
		updatedAt: string
	}

	interface Lesson {
		id: string
		homework: string
		description: string
		title: string
		date: string
		files: File[] | null
	}

	interface Grade {
		id: string
		grade: string
		date: string
	}

	interface DisciplineGrades {
		discipline: string
		grades: Grade[]
	}

	interface File {
		originalName: string
		url: string
	}

	type StudentGrades = DisciplineGrades[]
}
