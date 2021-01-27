Algoritmo OrdenaPorInsercion
	Dimension v1[21];
	Definir v1 Como Entero;
	
	// Genera el arreglo v1 con números al azar
	Para i<-1 Hasta 20 Con Paso 1 Hacer
		v1[i]<- azar(100)
	FinPara
	
	// Compara e inserta
	i<- 1
	Mientras i <= 20
		aux<-v1[i]
		j<- i - 1
		Mientras j>0 & v1[j] > aux
			v1[j+1]<-v1[j];
			j<- j-1
		FinMientras
		v1[j+1]<-aux
		i<-i+1
	FinMientras
	// Escribe arreglo ordenado
	Para i<-1 hasta 20 hacer
		Escribir "posición " i " es: " v1[i];
	FinPara
FinAlgoritmo
