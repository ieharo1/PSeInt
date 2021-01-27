Algoritmo SumadeMatrices
	Definir filas, columnas, i, j Como Entero
	Escribir "Cuantas filas tiene su matriz?"
	Leer filas
	Escribir "Cuantas columnas tiene su matriz?"
	Leer columnas
	Dimension A[filas,columnas]
	
	//Procedimiento para leer la matriz
	Para i<-1 Hasta filas Con Paso 1 Hacer
		Para j<-1 Hasta columnas Con Paso 1 Hacer
			Escribir "Ingrese el elemnto de la fila " filas " y columna " j
			Leer 	A[i,j]
		FinPara
	FinPara
	
	//Procedimiento para leer la matriz
	Para i<-1 Hasta filas Con Paso 1 Hacer
		Escribir sin saltar "|"
		Para j<-1 Hasta columnas Con Paso 1 Hacer
			Escribir Sin Saltar A[i,j]
		FinPara
		Escribir "|"
	FinPara
FinAlgoritmo
