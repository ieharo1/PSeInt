Algoritmo Calificaciones
	Dimension Alumno[50]
	Dimension Q1[50]
	Dimension Q2[50]
	i<-1
	p1<-0
	p2<-0
	Repetir
		Escribir "Nombre del Alumno"
		Leer Alumno[i]
		Escribir "Q1"
		Leer Q1[i]
		p1<-Q1[i]+p1
		Escribir "Q2"
		Leer Q2[i]
		p2<-Q2[i]+p2
		Escribir "El promedio es : " (Q1[i]+Q2[i])/2
		Escribir "Desea ingresar otro alumno(s/n)?"
		Leer opc
		i<-i+1
	Hasta Que opc="n"
	Escribir ""
	Escribir "El promedio del curso en Q1 es:" p1/(i-1)
	Escribir "El promedio del curso en Q2 es:" p2/(i-1)
	Escribir "El promedio del curso de los bimestres es:" (p1+p2)/(2*(i-1))
FinAlgoritmo
