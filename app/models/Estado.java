package models;

import com.google.code.morphia.annotations.Entity;
import play.data.validation.Required;
import play.data.validation.Unique;
import play.modules.morphia.Model;

/**
 *
 * @author Beny
 */
@Entity
public class Estado extends BaseModel {

    @Required
    public String clave;

    @Required
    public String nombre;

    public Estado(String clave, String nombre) {
        this.clave = clave;
        this.nombre = nombre;
    }

    public static void fillEstados() {
        if (Estado.findAll().isEmpty()) {
            Estado e;
            e = new Estado("1", "Aguascalientes");
            e.save();
            e = new Estado("2", "Baja California");
            e.save();
            e = new Estado("3", "Baja California Sur");
            e.save();
            e = new Estado("4", "Campeche");
            e.save();
            e = new Estado("5", "Chiapas");
            e.save();
            e = new Estado("6", "Chihuahua");
            e.save();
            e = new Estado("7", "Coahuila");
            e.save();
            e = new Estado("8", "Colima");
            e.save();
            e = new Estado("9", "Distrito Federal");
            e.save();
            e = new Estado("10", "Durango");
            e.save();
            e = new Estado("11", "Estado de México");
            e.save();
            e = new Estado("12", "Guanajuato");
            e.save();
            e = new Estado("13", "Guerrero");
            e.save();
            e = new Estado("14", "Hidalgo");
            e.save();
            e = new Estado("15", "Jalisco");
            e.save();
            e = new Estado("16", "Michoacán");
            e.save();
            e = new Estado("17", "Morelos");
            e.save();
            e = new Estado("18", "Nayarit");
            e.save();
            e = new Estado("19", "Nuevo León");
            e.save();
            e = new Estado("20", "Oaxaca");
            e.save();
            e = new Estado("21", "Puebla");
            e.save();
            e = new Estado("22", "Querétaro");
            e.save();
            e = new Estado("23", "Quintana Roo");
            e.save();
            e = new Estado("24", "San Luis Potosí");
            e.save();
            e = new Estado("25", "Sinaloa");
            e.save();
            e = new Estado("26", "Sonora");
            e.save();
            e = new Estado("27", "Tabasco");
            e.save();
            e = new Estado("28", "Tamaulipas");
            e.save();
            e = new Estado("29", "Tlaxcala");
            e.save();
            e = new Estado("30", "Veracruz");
            e.save();
            e = new Estado("31", "Yucatán");
            e.save();
            e = new Estado("32", "Zacatecas");
            e.save();
        }
    }

}
