import com.adito.agent.client.util.Transformation;
import java.io.IOException;

public class DWORDTransformer
    implements Transformation
{

    public DWORDTransformer()
    {
    }

    public String transform(String input)
        throws IOException
    {
        try
        {
            if(input.equalsIgnoreCase("true") || input.equalsIgnoreCase("false"))
                return input.equalsIgnoreCase("true") ? "1" : "0";
        }
        catch(NumberFormatException e)
        {
            return (new StringBuilder(String.valueOf(input))).append(" ERROR: ").append(e.getMessage()).toString();
        }
        return Integer.toHexString(Integer.parseInt(input));
    }
}
