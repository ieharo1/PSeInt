Algoritmo burbuja
	Dimension v1[1001];
	Definir v1 Como Entero;
	// Genera el arreglo v1 con números al azar
	Para i<-1 Hasta 1000 Con Paso 1 Hacer
		v1[i]<- azar(1000)
	FinPara
	
	// Ordena los elementos de v1 ascendentemente intercambiando posición
	Para i<-2 Hasta 1000 Hacer
		Para j<-1 Hasta 1001-i Hacer
			Si v1[j]>v1[j+1] Entonces
				aux<-v1[j]
				v1[j]<-v1[j+1]
				v1[j+1]<-aux
			FinSi
		FinPara
	FinPara
	
	// Escribe el arreglo ordenado
	Para i<-1 hasta 1000 Hacer
		Escribir "posición " i " es: " v1[i];
	FinPara
FinAlgoritmo 
