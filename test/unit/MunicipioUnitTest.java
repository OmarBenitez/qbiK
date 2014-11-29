package unit;

import models.Estado;
import models.Municipio;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import org.junit.Before;
import org.junit.Test;
import play.test.UnitTest;

/**
 *
 *
 * @author Oscar Raul Gutierrez Almanza
 * @version 1
 * @since Nov 29, 2014
 * @see
 */
public class MunicipioUnitTest extends UnitTest {

    @Before
    public void setBefore() {
        Estado.deleteAll();
        Municipio.deleteAll();
    }

    @Test
    public void testMunicipio() {

        String claveEstado = "6",
                nombreEstado = "Chihuahua",
                nombreEstado2 = "Durango",
                nombreMunicipio = "Chihuahua",
                nombreMunicipio2 = "Delicias",
                claveMunicipio = "180";

        Estado estado = new Estado(claveEstado, nombreEstado);
        estado.clave = claveEstado;
        estado.nombre = nombreEstado;
        assertTrue("Se debe poder guardar un estado",
                estado.validateAndSave());

        Municipio municipio
                = new Municipio(claveMunicipio, nombreMunicipio, Integer.SIZE);
        municipio.clave = claveMunicipio;
        municipio.nombre = nombreMunicipio;
        municipio.estado = estado;
        assertTrue("Se debe poder guardar un municipio",
                municipio.validateAndSave());

        //Probar validaciones
        //email
        municipio.clave = null;
        assertFalse("No se debe guardar un clave nulo",
                municipio.validateAndSave());

        municipio.clave = "";
        assertFalse("No se debe guardar un clave vacio",
                municipio.validateAndSave());

        municipio.clave = claveMunicipio;

        //nombre
        municipio.nombre = null;
        assertFalse("No se debe guardar un nombre nulo",
                municipio.validateAndSave());

        municipio.nombre = "";
        assertFalse("No se debe guardar un nombre vacio",
                municipio.validateAndSave());
        municipio.nombre = nombreMunicipio;

        //Update
        //nombre
        municipio.nombre = nombreMunicipio2;
        assertTrue("Se debe guardar el nombre editado",
                estado.validateAndSave());
        assertEquals("Se debe haber actualizado", nombreMunicipio2, municipio.nombre);

        //delete
        estado.delete();
        municipio.delete();

        assertNull("Se debe poder borrar municipio",
                Municipio.find("clave", claveMunicipio).first());

    }

}
