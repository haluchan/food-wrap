<?php
/**
 * 表單令牌(防止表單惡意提交)
 */
class AccessToken {
    const  SESSION_KEY = 'SESSION_KEY' ;
    /**
     * 生成一個當前的token
     * @param string $form_name
     * @return string
     */
    public  static  function  grante_token( $form_name )
    {
        $key  = self::grante_key();
                $_SESSION ["SESSION_KEY.$form_name"] = $key ;
        $token  = md5( substr (time(), 0, 3). $key . $form_name );
        return  $token ;
    }
 
    /**
     * 驗證一個當前的token
     * @param string $form_name
     * @return string
     */
    public  static  function  is_token( $form_name , $token )
    {
        $key  = $_SESSION ["SESSION_KEY.$form_name"];
        $old_token  = md5( substr (time(), 0, 3). $key . $form_name );
        if ( $old_token  == $token )
        {
            return  true;
        } else  {
            return  false;
        }
    }
 
    /**
     * 刪除一個token
     * @param string $form_name
     * @return boolean
     */
    public  static  function  drop_token( $form_name )
    {
        $session -> delete ("SESSION_KEY.$form_name");
        return  true;
    }
 
    /**
     * 生成一個密鑰
     * @return string
     */
    public  static  function  grante_key()
    {
        $encrypt_key  = md5(((float) date ( "YmdHis" ) + rand(100,999)).rand(1000,9999));
        return  $encrypt_key ;
    }
}
?>