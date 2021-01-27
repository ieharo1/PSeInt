Algoritmo seleccion
	Dimension v1[21];
	Definir v1 Como Entero;
	
	// Genera el arreglo v1 con números al azar
	Para i<-1 Hasta 20 Con Paso 1 Hacer
		v1[i]<- azar(100)
	FinPara
	
	// Pone el mayor al último y luego repite con los otros elementos
	Para i<-1 hasta 20 hacer
		min<-i;
		Para j<-i Hasta 20 Hacer
			Si v1[j]<v1[min] entonces
				min<-j;
			FinSi
		FinPara
		aux<-v1[i];
		v1[i]<-v1[min];
		v1[min]<-aux;
	FinPara
	
	// Escribe el arreglo ordenado
	Para i<-1 hasta 20 hacer
		Escribir "posicion " i " es: " v1[i];
	FinPara
FinAlgoritmo

