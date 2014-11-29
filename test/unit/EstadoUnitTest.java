
package unit;

import models.Estado;
import models.Municipio;
import models.Usuario;
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
public class EstadoUnitTest extends UnitTest {
      @Before
    public void setBefore(){
        Estado.deleteAll();
    }

    @Test
    public void testEstado() {

        String claveEstado = "6",
                nombreEstado = "Chihuahua",
                nombreEstado2 = "Durango";

        Estado estado = new Estado(claveEstado, nombreEstado);
        estado.clave = claveEstado;
        estado.nombre = nombreEstado;
        assertTrue("Se debe poder guardar un estado",
                estado.validateAndSave());

        //Probar validaciones
        //email
        estado.clave = null;
        assertFalse("No se debe guardar un clave nulo",
                estado.validateAndSave());
        
        estado.clave = "";
        assertFalse("No se debe guardar un clave vacio",
                estado.validateAndSave());
        
        estado.clave = claveEstado;
        
        //nombre
        estado.nombre = null;
        assertFalse("No se debe guardar un nombre nulo",
                estado.validateAndSave());

        estado.nombre = "";
        assertFalse("No se debe guardar un nombre vacio",
                estado.validateAndSave());
        estado.nombre = nombreEstado;

        //Update
        //nombre
        estado.nombre = nombreEstado2;
        assertTrue("Se debe guardar el nombre editado",
                estado.validateAndSave());
        assertEquals("Se debe haber actualizado", nombreEstado2, estado.nombre);

        //delete
        estado.delete();

        assertNull("Se debe poder borrar usuario",
                Estado.find("clave", claveEstado).first());

    }


}
