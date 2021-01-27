
Algoritmo SumadeMatrices
	//Definir  cuantas filas y columnas
	Definir filasA, columnasA, filasB, columnasB, i, j, noMat Como Entero
	Escribir "Cuantas filas tiene su matriz A?"
	Leer filasA
	Escribir "Cuantas columnas tiene su matriz A?"
	Leer columnasA
	Dimension A[filasA,columnasA]
	
	//Procedimiento para leer la matriz A
	Para i<-1 Hasta filasA Con Paso 1 Hacer
		Para j<-1 Hasta columnasA Con Paso 1 Hacer
			Escribir "Ingrese el elemnto de la fila " i " y columna " j
			Leer 	A[i,j]
		FinPara
	FinPara
	Escribir "Numero de filas de A: " filasA
	Escribir "Numero de de columnas de A: " columnasA
	
	//Definir  cuantas filas y columnas
	Escribir "Cuantas filas tiene su matriz B?"
	Leer filasB
	Escribir "Cuantas columnas tiene su matriz B?"
	Leer columnasB
	Dimension B[filasB,columnasB]
	
	//Procedimiento para leer la matrizB
	Para i<-1 Hasta filasB Con Paso 1 Hacer
		Para j<-1 Hasta columnasB Con Paso 1 Hacer
			Escribir "Ingrese el elemnto de la fila " i " y columna " j
			Leer 	B[i,j]
		FinPara
	FinPara
	
	//Procedimiento para escribir la matriz A
	Escribir "****Esta es la matriz A*****"
	noMat<-redon(filasA/2)
	Para i<-1 Hasta filasA Con Paso 1 Hacer
		Si noMat=i Entonces
			Escribir Sin Saltar "A=| "
		SiNo
			Escribir sin Saltar "  | "
		FinSi
		Para j<-1 Hasta columnasA Con Paso 1 Hacer
			Escribir Sin Saltar A[i,j]
		FinPara
		Escribir " |"
	FinPara
	
	//Procedimiento para escribir la matriz B
	Escribir "****Esta es la matriz B*****"
	noMat<-redon(filasB/2)
	Para i<-1 Hasta filasB Con Paso 1 Hacer
		Si noMat=i Entonces
			Escribir Sin Saltar "B=| "
		SiNo
			Escribir sin saltar "  | "
		FinSi
		Para j<-1 Hasta columnasB Con Paso 1 Hacer
			Escribir Sin Saltar B[i,j]
		FinPara
		Escribir " |"
	FinPara
FinAlgoritmo
