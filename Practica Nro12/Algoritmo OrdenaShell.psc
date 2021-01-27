Algoritmo OrdenaShell
	Dimension v1[21];
	Definir v1 Como Entero
	Definir h Como Entero
	
	// Genera el arreglo v1 con números al azar
	Para i<-1 Hasta 20 Con Paso 1 Hacer
		v1[i]<- azar(100)
	FinPara
	
	// Genera un valor grande respecto al número de elementos iniciales
	h<-1
	Mientras h<=20 Hacer
		h<-h*3
		h<-h+1
	FinMientras
	Escribir h
	Repetir
		h<-trunc(h/3);    // Reduce el tamaño de h
		Para j<-h+1 Hasta 20 Con Paso 1 Hacer
			aux<-v1[j]
			i<-j-h
			Mientras i>0 & v1[i]>aux Hacer
				v1[i+h]<-v1[i]
				i<-i-h
			Fin Mientras
			v1[i+h]<-aux
		Fin Para
	Hasta Que h<=1
	// Escribe el arreglo ordenado
	Para i<-1 hasta 20 hacer
		Escribir "posicion " i " es: " v1[i];
	FinPara
FinAlgoritmo
